exports.port = process.argv[2] || process.env.PORT || 8081;
exports.dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/burguer-queen';
exports.secret = process.env.JWT_SECRET || 'esta-es-la-api-burger-queen';
exports.adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost';
exports.adminPassword = process.env.ADMIN_PASSWORD || 'changeme';
