import fs from 'fs';
let code = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

const updateOpeningHoursStr = `  const updateOpeningHours = (day: string, type: string, val: string) => {
      const newHours = {
          ...openingHours,
          [day]: { ...openingHours[day], [type]: val }
      };
      setOpeningHours(newHours);
      updateSetting('openingHours', newHours);
  };`;

const updateOpeningHoursNewStr = `  const updateOpeningHours = (day: string, type: string, val: string) => {
      const newHours = {
          ...openingHours,
          [day]: { ...openingHours[day], [type]: val }
      };
      setOpeningHours(newHours);
      updateSetting('openingHours', newHours);
  };

  const updateOpeningHoursMulti = (day: string, updates: Record<string, string>) => {
      const newHours = {
          ...openingHours,
          [day]: { ...openingHours[day], ...updates }
      };
      setOpeningHours(newHours);
      updateSetting('openingHours', newHours);
  };`;

code = code.replace(updateOpeningHoursStr, updateOpeningHoursNewStr);

const checkboxStr = `                                                          if (e.target.checked) {
                                                              updateOpeningHours(day, 'breakStart', '');
                                                              updateOpeningHours(day, 'breakEnd', '');
                                                          } else {
                                                              updateOpeningHours(day, 'breakStart', '12:00');
                                                              updateOpeningHours(day, 'breakEnd', '13:00');
                                                          }`;

const checkboxNewStr = `                                                          if (e.target.checked) {
                                                              updateOpeningHoursMulti(day, { breakStart: '', breakEnd: '' });
                                                          } else {
                                                              updateOpeningHoursMulti(day, { breakStart: '12:00', breakEnd: '13:00' });
                                                          }`;

code = code.replace(checkboxStr, checkboxNewStr);

fs.writeFileSync('components/AdminPanel.tsx', code);
