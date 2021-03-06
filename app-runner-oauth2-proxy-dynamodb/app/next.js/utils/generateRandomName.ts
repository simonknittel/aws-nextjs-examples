const colors = [
  "Black",
  "Blue",
  "Brown",
  "Cyan",
  "Green",
  "Gray",
  "Magenta",
  "Orange",
  "Pink",
  "Purple",
  "Red",
  "White",
  "Yellow",
];

const animals = [
  "Alligator",
  "Ant",
  "Arctic wolf",
  "Badger",
  "Bald eagle",
  "Bat",
  "Bear",
  "Bee",
  "Beetle",
  "Black bird",
  "Blue whale",
  "Butterfly",
  "Camel",
  "Cat",
  "Centipede",
  "Chicken",
  "Chimpanzee",
  "Clams",
  "Cockroach",
  "Coral",
  "Cormorant",
  "Cow",
  "Coyote",
  "Coyote",
  "Crab",
  "Crocodile",
  "Crow",
  "Deer",
  "Dog",
  "Dolphin",
  "Dove",
  "Dragonfly",
  "Ducks",
  "Elephant",
  "Elk",
  "Fish",
  "Flamingo",
  "Fly",
  "Fox",
  "Frog",
  "Giraffe",
  "Goat",
  "Goldfish",
  "Goose",
  "Gorilla",
  "Grasshopper",
  "Hamster",
  "Hare",
  "Hawk",
  "Hedgehog",
  "Hippopotamus",
  "Horse",
  "Jellyfish",
  "Kangaroo",
  "Kitten",
  "Koala",
  "Leopard",
  "Lion",
  "Lizard",
  "Lobster",
  "Louse",
  "Mole",
  "Monkey",
  "Mosquito",
  "Moth",
  "Mouse",
  "Octopus",
  "Ostrich",
  "Otter",
  "Owl",
  "Ox",
  "Panda",
  "Parrot",
  "Peacock",
  "Pelican",
  "Penguin",
  "Pig",
  "Pigeon",
  "Puppy",
  "Rabbit",
  "Raccoon",
  "Rat",
  "Raven",
  "Reindeer",
  "Robin",
  "Sea anemone",
  "Sea lion",
  "Sea turtle",
  "Sea urchin",
  "Seagull",
  "Seahorse",
  "Seal",
  "Shark",
  "Sheep",
  "Shells",
  "Shrimp",
  "Snake",
  "Sparrow",
  "Spider",
  "Squid",
  "Squirrel",
  "Starfish",
  "Stork",
  "Swallow",
  "Swan",
  "Tiger",
  "Toad",
  "Tropical fish",
  "Turkey",
  "Turtle",
  "Walrus",
  "Whale",
  "Woodpecker",
  "Worm",
];

export function generateRandomName() {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

  return `${randomColor} ${randomAnimal}`;
}
