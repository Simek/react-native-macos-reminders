export default {
  KEYS: ['all', 'scheduled', 'today', 'flagged'],
  COLORS: {
    all: { semantic: 'secondaryLabelColor' },
    scheduled: { semantic: 'systemRedColor' },
    today: { semantic: 'systemBlueColor' },
    flagged: { semantic: 'systemOrangeColor' },
  },
  STORE: {
    today: [],
    scheduled: [],
    flagged: [],
    all: [],
  },
};
