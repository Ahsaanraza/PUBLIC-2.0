// --- Helpers ---
                          export const formatDate = (date) => {
                            if (!date) return '';
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
                          };

                          export const generateMonthData = (year, month) => {
                            const daysInMonth = new Date(year, month + 1, 0).getDate();
                            const firstDay = new Date(year, month, 1).getDay();
                            const startOffset = firstDay === 0 ? 6 : firstDay - 1; 
                            const days = [];
                            for (let i = 0; i < startOffset; i++) days.push(null);
                            for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
                            return days;
                          };