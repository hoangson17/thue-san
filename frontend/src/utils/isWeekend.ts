  function isWeekend(dateString:any) {
    const d = new Date(dateString);
    const day = d.getDay(); // 0 = Chủ nhật, 6 = Thứ 7
    return day === 0 || day === 6;
  }
  
  export default isWeekend