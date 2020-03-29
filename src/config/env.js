// Load environment variables from .env file, where API keys and passwords are configured
// require('dotenv').config({
//   path: !process.env.NODE_ENV || process.env.NODE_ENV === 'production' ? '.env' : `.env.${process.env.NODE_ENV}`
// })
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') { // production
  process.env.PORT = process.env.PORT || 8001
  process.env.BASE_URL = '/'
  process.env.PUBLIC_PATH = 'public'
  process.env.STATIC_PATH = 'static'
  process.env.UPLOAD_PATH = 'uploads'
  process.env.MONGODB_ATLAS = 'mongodb+srv://developer:tvD5zbAYQryXeFP7@cluster0-sb5wt.gcp.mongodb.net/tm-store'
  process.env.MONGODB = 'mongodb+srv://developer:tvD5zbAYQryXeFP7@cluster0-sb5wt.gcp.mongodb.net/tm-store?retryWrites=true&w=majority'
  process.env.SECRET = '03890a36-8888-45fe-8aa4-efb24469afb0'
} else { // development
  process.env.PORT = process.env.PORT || 8001
  process.env.BASE_URL = '/'
  process.env.PUBLIC_PATH = 'public'
  process.env.STATIC_PATH = 'static'
  process.env.UPLOAD_PATH = 'uploads'
  process.env.MONGODB_ATLAS = 'mongodb+srv://developer:tvD5zbAYQryXeFP7@cluster0-sb5wt.gcp.mongodb.net/tm-store'
  // process.env.MONGODB = 'mongodb://localhost:27017/tm-store'
  process.env.MONGODB = 'mongodb+srv://developer:tvD5zbAYQryXeFP7@cluster0-sb5wt.gcp.mongodb.net/tm-store?retryWrites=true&w=majority'
  process.env.SECRET = '03890a36-8888-45fe-8aa4-efb24469afb0'
}
