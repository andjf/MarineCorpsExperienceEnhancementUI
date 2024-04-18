export enum CommandCode {
    KBM = "Kbay",
    IWM = "Iwakuni",
    SDM = "MCRD San Diego",
    CLM = "Camp Lejeune",
    QUM = "Quantico",
    HHM = "Henderson Hall",
    PNM = "Camp Pendleton",
    SCM = "South Carolina",
    ALM = "Albany",
    MRM = "Miramar",
    ELM = "Camp Elmore",
    CPM = "Cherry Point",
    TWM = "29 Palms",
    RDCW = "West",
    RDCE = "East",
}

export function commandCodeToLink(commandCode: CommandCode): string {
    switch (commandCode) {
        case CommandCode.KBM:
            return "https://mccs.kbay.usmc.mil";
        case CommandCode.IWM:
            return "https://mccsiwakuni.com";
        case CommandCode.SDM:
            return "https://mccsmiramar.com";
        case CommandCode.CLM:
            return "https://mccslejeune-newriver.com";
        case CommandCode.QUM:
            return "https://mccsquanticomarinecorpsbase.com";
        case CommandCode.HHM:
            return "https://mccshh.com";
        case CommandCode.PNM:
            return "https://mccsmiramar.com";
        case CommandCode.SCM:
            return "https://mccs-sc.com";
        case CommandCode.ALM:
            return "https://mccsalbany.com";
        case CommandCode.MRM:
            return "https://mccsmiramar.com";
        case CommandCode.ELM:
            return "https://mccscherrypoint.com";
        case CommandCode.CPM:
            return "https://mccscherrypoint.com";
        case CommandCode.TWM:
            return "https://mccstwentynine.com";
        case CommandCode.RDCW:
            return "https://mccs29.com";
        case CommandCode.RDCE:
            return "https://mccslejeune-newriver.com";
        default:
            return "https://mccs.com";
    }
}
