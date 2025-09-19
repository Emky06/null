let handler = async (m) => {
    let funzionitotali = Object.values(global.plugins).filter(v => v.command).length;
    let num1 = ['𝟎', '𝟏', '𝟐', '𝟑', '𝟒', '𝟓', '𝟔', '𝟕', '𝟖', '𝟗'];
    let num2 = funzionitotali.toString().split('').map(digit => num1[digit]).join('');
    m.reply(`ⓘ 𝐈𝐥 𝐛𝐨𝐭 𝐡𝐚 ${num2}  𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐢.`);
}
handler.command = ['funzionitotali', 'functions'];
export default handler;