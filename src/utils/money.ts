export const money = (n: number) => '$ ' + Math.round(n).toLocaleString('es-AR');
export const moneyShort = (n: number) => n >= 1e6 ? '$ ' + (n / 1e6).toFixed(1).replace('.', ',') + ' M' : n >= 1e3 ? '$ ' + Math.round(n / 1000) + ' mil' : '$ ' + Math.round(n);
