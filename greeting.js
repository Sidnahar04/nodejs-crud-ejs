greetings = [
    'Hello',
    'Hi',
    `What's Up`,
    'Afternoon',
    'Greetings of the day',
    'Good Evening',
    'Good Morning',
    'How you doin!!'
]

const getRandomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

module.exports = getRandomGreeting;