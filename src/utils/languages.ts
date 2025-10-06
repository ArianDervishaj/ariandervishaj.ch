export interface Language {
  name: string;
  iconName?: string;
  className?: string;
}

export const languages: Record<string, Language> = {
  python: {
    name: "Python",
    iconName: "python",
  },
  linux: {
    name: "Linux",
    iconName: "linux",
  },
  wireshark: {
    name: "Wireshark",
    iconName: "wireshark",
  },
  wazuh: {
    name: "Wazuh",
    iconName: "wazuh",
  },
  nmap: {
    name: "Nmap",
    iconName: "nmap",
  },
  docker: {
    name: "Docker",
    iconName: "docker",
  },
  virtualisation: {
    name: "Virtualisation",
    iconName: "virtualisation",
  },
  tcpip: {
    name: "TCP/IP",
    iconName: "tcpip",
  },
  cisco: {
    name: "Cisco",
    iconName: "cisco",
  },
  git: {
    name: "Git",
    iconName: "git",
  },
  sql: {
    name: "MySQL",
    iconName: "mysql",
  },
  c: {
    name: "C",
    iconName: "c",
  },
  openssl:{
    name: "OpenSSL",
  },
  pki:{
    name: "PKI",
  },
  networking:{
    name: "Networking"
  },
  gns3:{
    name: "GNS3"
  },
  httrack:{
    name: "HTTrack"
  },
  dirb:{
    name: "Dirb"
  }
};
export const getLanguage = (lang: string): Language => {
  return languages[lang] || languages.cisco;
}; 