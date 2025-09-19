const commands = [];

export function cmd(info, func) {
    const data = info;
    data.function = func;

    if (!data.dontAddCommandList) data.dontAddCommandList = false;
    if (!data.desc) data.desc = '';
    if (!data.fromMe) data.fromMe = false;
    if (!data.category) data.category = 'misc';
    if (!data.filename) data.filename = 'Not Provided';

    commands.push(data);
    return data;
}

// Esportazioni multiple per compatibilità
export const AddCommand = cmd;
export const Function = cmd;
export const Module = cmd;
export { commands };