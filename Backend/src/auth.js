function ensureAuthenticated(context) {
    if (!context.currentUser) {
      throw new Error('Not authenticated');
    }
  }
  
  module.exports= {
    ensureAuthenticated,
  };
  