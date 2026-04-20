const gameImagesBySubCategory = {
  'Cricket': '/game-images/cricket.jpg',
  'Football': '/game-images/football.jpg',
  'Volleyball': '/game-images/volleyball.jpg',
  'Kabaddi': '/game-images/kabaddi.jpg',
  'Kho Kho': '/game-images/kho-kho.jpg',
  'Chess': '/game-images/chess.jpg',
  'Table Tennis': '/game-images/table-tennis.jpg',
  'Badminton': '/game-images/badminton.jpg',
  '100m Race': '/game-images/race-100m.jpg',
  '400m Race': '/game-images/race-400m.jpg',
  'Relay Race': '/game-images/relay-race.jpg',
  'Long Jump': '/game-images/long-jump.jpg',
  'Shot Put': '/game-images/shot-put.jpg'
};

export const getLocalGameImage = (subCategory) => gameImagesBySubCategory[subCategory] || '';

