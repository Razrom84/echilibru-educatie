export const JOC_COPY = {
  title: "Joc",
  intro: "Împreună cu părintele. La sfârșit, o misiune în casă sau în curte.",
  loading: "Se deschide jocul…",
  toMission: "La misiune",
  forParent: "Pentru părinte",
  noteLabel: "Notă (opțional)",
  notePlaceholder: "Ce a făcut în casă sau în curte",
  done: "Gata",
  ritualBack: "Înapoi la joc",
  journalTitle: "Jurnal",
  journalHint: "Rămâne pe tabletă, în acest browser.",
  journalEmpty: "Încă nu este nicio sesiune.",
  export: "Exportă",
  missionPending: "Misiune deschisă",
  emptyWeek: "Săptămâna aceasta nu are încă scene.",
} as const;

export function openMissionLabel(levelName: string): string {
  return `Misiunea cu ${levelName} a rămas deschisă.`;
}
