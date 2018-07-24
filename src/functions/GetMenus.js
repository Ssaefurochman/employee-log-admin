export default (role) => {
  switch (role) {
    case 'direktur':
      return [
        { icon: 'home', text: 'Home Direktur', action: '/' },
      ]
    case 'manager':
      return [
        { icon: 'home', text: 'Home Manager', action: '/' },
      ]
    case 'pegawai':
      return [
        { icon: 'home', text: 'Home', action: '/' },
        {
          icon: 'calendar_today',
          'icon-alt': 'calendar_today',
          text: 'Journals',
          model: false,
          children: [
            { text: 'Show All Journals', action: '/journals' }
          ]
        },
      ]
    default:
      return []
  }
}
