import { migrateLegacyDataStructure } from '~/utils/storage';

describe('Data migration', () => {
  it('Should migrate the data from legacy format on load', async () => {
    const legacyData = {
      today: [],
      scheduled: [],
      flagged: [],
      all: [],
      completed: [],
    };

    const data = migrateLegacyDataStructure(legacyData);

    expect(data).toEqual({
      today: { reminders: [] },
      scheduled: { showCompleted: true, reminders: [] },
      flagged: { showCompleted: true, reminders: [] },
      all: { showCompleted: true, reminders: [] },
      completed: { reminders: [] },
    });
  });
});
