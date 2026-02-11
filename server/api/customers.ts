export default defineEventHandler((): User[] => {
  return [
    {
      id: 1,
      username: 'mrossi',
      email: 'm.rossi@email.com',
      avatar: {
        src: 'https://i.pravatar.cc/150?img=1',
        alt: 'Mario Rossi'
      },
      status: 'subscribed',
      type: 'creator',
      documentsVerified: true,
      newContents: true,
      supporter: true,
      location: 'Milano, IT'
    },
    {
      id: 2,
      username: 'lbianchi',
      email: 'l.bianchi@email.com',
      avatar: {
        src: 'https://i.pravatar.cc/150?img=2',
        alt: 'Luca Bianchi'
      },
      status: 'unsubscribed',
      type: 'user',
      documentsVerified: false,
      newContents: false,
      supporter: false,
      location: 'Roma, IT'
    },
    {
      id: 3,
      username: 'fverdi',
      email: 'f.verdi@email.com',
      avatar: {
        src: 'https://i.pravatar.cc/150?img=3',
        alt: 'Francesca Verdi'
      },
      status: 'subscribed',
      type: 'creator',
      documentsVerified: true,
      newContents: false,
      supporter: true,
      location: 'Torino, IT'
    },
    {
      id: 4,
      username: 'gneri',
      email: 'g.neri@email.com',
      avatar: {
        src: 'https://i.pravatar.cc/150?img=4',
        alt: 'Giulia Neri'
      },
      status: 'bounced',
      type: 'user',
      documentsVerified: false,
      newContents: true,
      supporter: false,
      location: 'Bologna, IT'
    },
    {
      id: 5,
      username: 'amarino',
      email: 'a.marino@email.com',
      avatar: {
        src: 'https://i.pravatar.cc/150?img=5',
        alt: 'Alessandro Marino'
      },
      status: 'subscribed',
      type: 'creator',
      documentsVerified: true,
      newContents: true,
      supporter: false,
      location: 'Firenze, IT'
    },
    {
      id: 6,
      username: 'sricci',
      email: 's.ricci@email.com',
      avatar: {
        src: 'https://i.pravatar.cc/150?img=6',
        alt: 'Sara Ricci'
      },
      status: 'unsubscribed',
      type: 'user',
      documentsVerified: false,
      newContents: false,
      supporter: true,
      location: 'Napoli, IT'
    },
    {
      id: 7,
      username: 'dferrari',
      email: 'd.ferrari@email.com',
      avatar: {
        src: 'https://i.pravatar.cc/150?img=7',
        alt: 'Davide Ferrari'
      },
      status: 'subscribed',
      type: 'creator',
      documentsVerified: true,
      newContents: false,
      supporter: true,
      location: 'Verona, IT'
    },
    {
      id: 8,
      username: 'ecosta',
      email: 'e.costa@email.com',
      avatar: {
        src: 'https://i.pravatar.cc/150?img=8',
        alt: 'Elena Costa'
      },
      status: 'unsubscribed',
      type: 'user',
      documentsVerified: true,
      newContents: true,
      supporter: false,
      location: 'Genova, IT'
    },
    {
      id: 9,
      username: 'rgreco',
      email: 'r.greco@email.com',
      avatar: {
        src: 'https://i.pravatar.cc/150?img=9',
        alt: 'Roberto Greco'
      },
      status: 'bounced',
      type: 'user',
      documentsVerified: false,
      newContents: false,
      supporter: false,
      location: 'Palermo, IT'
    },
    {
      id: 10,
      username: 'clombardi',
      email: 'c.lombardi@email.com',
      avatar: {
        src: 'https://i.pravatar.cc/150?img=10',
        alt: 'Chiara Lombardi'
      },
      status: 'subscribed',
      type: 'creator',
      documentsVerified: true,
      newContents: true,
      supporter: true,
      location: 'Padova, IT'
    }
  ]
})
