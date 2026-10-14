const flashMiddleware = (req, res, next) => {
  req.flash = (type, message) => {
    if (!req.session.flash) {
      req.session.flash = { success: [], error: [], warning: [], info: [] };
    }

    // Guardar un mensaje
    if (type && message) {
      if (!req.session.flash[type]) {
        req.session.flash[type] = [];
      }
      req.session.flash[type].push(message);
      return;
    }

    // Leer y borrar los mensajes de un tipo
    if (type) {
      const messages = req.session.flash[type] || [];
      req.session.flash[type] = [];
      return messages;
    }

    // Leer y borrar todos los mensajes
    const allMessages = req.session.flash;
    req.session.flash = { success: [], error: [], warning: [], info: [] };
    return allMessages;
  };

  next();
};

const flashLocals = (req, res, next) => {
  res.locals.flash = req.flash;
  next();
};

const flash = (req, res, next) => {
  flashMiddleware(req, res, () => {
    flashLocals(req, res, next);
  });
};

export default flash;
