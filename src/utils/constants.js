export default {
  KEYS: ['all', 'scheduled', 'today', 'flagged', 'completed'],
  COLORS: {
    all: { semantic: 'secondaryLabelColor' },
    scheduled: { semantic: 'systemRedColor' },
    today: { semantic: 'systemBlueColor' },
    flagged: { semantic: 'systemOrangeColor' },
    completed: { semantic: 'systemGrayColor' },
  },
  STORE: {
    today: [],
    scheduled: [],
    flagged: [],
    all: [],
    completed: [],
  },
};
