export default (role) => {
  switch (role) {
    case 'direktur':
      return [
        { icon: 'home', text: 'Home Direktur', action: '/' },
      ]
      break;
    case 'manager':
      return [
        { icon: 'home', text: 'Home Manager', action: '/' },
      ]
      break;
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
      break;
    default:
      return [
        { icon: 'home', text: 'Home', action: '/' },
        {
          icon: 'category',
          'icon-alt': 'category',
          text: 'Category',
          model: false,
          children: [
            { text: 'Show All Data', action: '/categories' }
          ]
        }
      ]
  }
}
