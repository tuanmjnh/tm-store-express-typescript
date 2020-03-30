const Model = require('../../models/users'),
  ModelRoles = require('../../models/roles'),
  ModelRoutes = require('../../models/routes'),
  middleware = require('../../services/middleware'),
  crypto = require('../../utils/crypto'),
  helpers = require('../../utils/helpers');

const generateRoutes_children = (routes, rolesRoutes) => {
  const rs = []
  console.log(routes)
  routes.forEach(e => {
    if (rolesRoutes.indexOf(e.name) >= 1) rs.push(e)
    else {
      if (e.children) {
        const tmp = generateRoutes(e.children, rolesRoutes)
        if (tmp.length > 0) {
          e.children = tmp
          rs.push(e)
        }
      }
    }
  })
  return rs
}
const generateRoutes = (routes, rolesRoutes, dependent = null) => {
  const rs = []
  try {
    const children = routes.filter(x => x.dependent !== null)
    routes.forEach(e => {
      const _dependent = e.dependent ? e.dependent.toString() : null
      if (rolesRoutes.indexOf(e.name) >= 0 && _dependent === dependent) {
        const child = generateRoutes(children, rolesRoutes, e._id.toString())
        if (child.length > 0) e.children = child
        rs.push(e)
      }
      // if (rolesRoutes.indexOf(e.name) >= 0 && e.parents !== null) {
      //   const x = routes.find(x => x._id.toString() === e.parents)
      //   if (x) {
      //     helpers.pushIfNotExist(x.children, e)
      //     helpers.pushIfNotExist(rs, x)
      //   }
      // }
    })
  } catch (e) { console.log(e) }
  return rs
}
const getAuthRoutes = async (authRoles) => {
  // Roles
  const roles = await ModelRoles.where({ _id: { $in: authRoles } }).sort({ level: 1 })
  let authRoutes = []
  roles.forEach(e => {
    helpers.pushIfNotExist(authRoutes, e.routes)
  })
  // Routes
  const routes = await ModelRoutes.where({ flag: 1 }).sort({ dependent: 1, orders: 1 })
  // console.log(routes)
  return generateRoutes(routes, authRoutes)
}
module.exports.get = async function(req, res, next) {
  try {
    const verify = middleware.verify(req, res)
    if (!verify) return
    const rs = await Model.findOne({ _id: verify._id })
    if (!rs) return res.status(402).json({ msg: 'token_invalid' })
    // Routes
    const routes = await getAuthRoutes(rs.roles)
    return res.status(200).json({ user: rs, routes: routes })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.post = async function(req, res, next) {
  try {
    // check req data
    if (!req.body.username || !req.body.password) return res.status(404).json({ msg: 'no_exist' })
    // throw new Error('wrong')
    const rs = await Model.findOne({ email: req.body.username })
    // console.log(rs)
    // not exist username
    if (!rs) return res.status(502).json({ msg: 'no_exist' })
    // check password
    if (rs.password !== crypto.md5(req.body.password + rs.salt)) return res.status(503).json({ msg: 'no_exist' })
    // check lock
    if (!rs.enable) return res.status(504).json({ msg: 'locked' })
    // Routes
    const routes = await getAuthRoutes(rs.roles)
    // Update last login
    await Model.updateOne({ _id: rs._id }, {
      $set: {
        last_login: new Date()
      }
    })
    // Token
    const token = middleware.sign({ _id: rs._id })
    if (rs) return res.status(200).json({ token: token, user: rs, routes: routes })
    else return res.status(401).json({ msg: 'wrong' })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
