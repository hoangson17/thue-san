const getDayType = (date?: Date) => {
  if (!date) return null;
  const day = date.getDay();
  return day === 0 || day === 6 ? "weekend" : "weekday";
};

export default getDayType;
