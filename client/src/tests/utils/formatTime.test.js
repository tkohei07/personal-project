import { formatTime } from '../../utils/formatTime';

describe('formatTime', () => {
  it('formats time correctly for AM hours', () => {
    const timeObj = { Valid: true, String: '08:30' };
    const formattedTime = formatTime(timeObj);
    expect(formattedTime).toEqual('8:30 am');
  });

  it('formats time correctly for PM hours', () => {
    const timeObj = { Valid: true, String: '15:30' };
    const formattedTime = formatTime(timeObj);
    expect(formattedTime).toEqual('3:30 pm');
  });

  it('formats time correctly for 12 PM', () => {
    const timeObj = { Valid: true, String: '12:00' };
    const formattedTime = formatTime(timeObj);
    expect(formattedTime).toEqual('12:00 pm');
  });

  it('formats time correctly for 12 AM', () => {
    const timeObj = { Valid: true, String: '00:00' };
    const formattedTime = formatTime(timeObj);
    expect(formattedTime).toEqual('12:00 am');
  });

  it('returns "Closed" for an invalid time object', () => {
    const timeObj = { Valid: false, String: '15:30' };
    const formattedTime = formatTime(timeObj);
    expect(formattedTime).toEqual('Closed');
  });

  it('returns "Closed" for a non-object input', () => {
    const timeObj = '15:30';
    const formattedTime = formatTime(timeObj);
    expect(formattedTime).toEqual('Closed');
  });
});
