/* eslint-disable max-len */

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

export function commandCodeToLink(commandCode: CommandCode): string | null {
    switch (commandCode) {
        case CommandCode.KBM:
            return "https://public.tableau.com/views/KBMCommandDashboard/DashboardKBM?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link";
        case CommandCode.IWM:
            return "https://public.tableau.com/views/IWMCommandDashboard/DashboardIWM?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link";
        case CommandCode.SDM:
            return "https://public.tableau.com/views/SDMCommandDashboard/DashboardSDM?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link";
        case CommandCode.CLM:
            return "https://public.tableau.com/views/CLMCommandDashboard/DashboardCLM?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link";
        case CommandCode.QUM:
            return "https://public.tableau.com/views/QUMCommandDashboard/DashboardQUM?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link";
        case CommandCode.HHM:
            return "https://public.tableau.com/shared/YXP72NSSF?:display_count=n&:origin=viz_share_link";
        case CommandCode.PNM:
            return "https://public.tableau.com/views/PNMCommandDashboard/DashboardPNM?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link";
        case CommandCode.SCM:
            return "https://public.tableau.com/views/SCMCommandDashboard/DashboardSCM?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link";
        case CommandCode.ALM:
            return "https://public.tableau.com/views/ALMCommandDashboard/DashboardALM?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link";
        case CommandCode.MRM:
            return "https://public.tableau.com/views/MRMCommandDashboard/DashboardMRM?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link";
        case CommandCode.ELM:
            return "https://public.tableau.com/views/ELMCommandDashboard/DashboardELM?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link";
        case CommandCode.CPM:
            return "https://public.tableau.com/views/CPMCommandDashboard/DashboardCPM?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link";
        case CommandCode.TWM:
            return "https://public.tableau.com/views/TWMCommandDashboard/DashboardTWM?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link";
        case CommandCode.RDCW:
            return "https://public.tableau.com/views/RDCWCommandDashboard/DashboardRDCW?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link";
        case CommandCode.RDCE:
            return "https://public.tableau.com/views/RDCECommandDashboard/DashboardRDCE?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link";
        default:
            return null;
    }
}
