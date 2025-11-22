'use strict';

module.exports = {
  // Automatically set isPastEvent based on eventDate
  async beforeUpdate(event) {
    const { data } = event.params;
    
    if (data.eventDate) {
      const eventDate = new Date(data.eventDate);
      const now = new Date();
      data.isPastEvent = eventDate < now;
    }
  },

  async beforeCreate(event) {
    const { data } = event.params;
    
    if (data.eventDate) {
      const eventDate = new Date(data.eventDate);
      const now = new Date();
      data.isPastEvent = eventDate < now;
    }
  },
};

