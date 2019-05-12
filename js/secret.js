const title = 'The Bug Count Also Rises'
const titleOptions = {
	strings: [title],
	typeSpeed: 60,
	showCursor: false,
	contentType: null,
}
const author = 'John Browne'
const authorOptions = {
	strings: [author],
	typeSpeed: 50,
	showCursor: false,
	contentType: null,
	startDelay: 3000,
}
const text = `
In the fall of that year the rains fell as usual and washed the leaves of the dust and dripped from the leaves onto the ground. The shuttles drove through the rainy streets and took the people to meetings, then later brought them back, their tires spraying the mist into the air.

Many days he stood for a long time and watched the rain and the shuttles and drank his double-tall mochas. With the mochas he was strong.

Hernando who worked down the hall and who was large with microbrews came to him and told him that the ship day was upon them but the bugs were not yet out. The bugs which were always there even when you were in Cafes late at night sipping a Redhook or a double-tall mocha and you thought you were safe but they were there and although Enrico kept the floor swept clean and the mochas were hot the bugs were there and they ate at you.

When Hernando told him this he asked how many bugs. “The RAID is huge with bugs,” Hernando said. “The bugs are infinite.”

“Why do you ask me? You know I cannot do this thing anymore with the bugs.”

“Once you were great with the bugs,” Hernando said. “No one was greater,” he said again. “Even Prado.”

“Prado? What of Prado? Let Prado fix the bugs.”

Hernando shrugged. “Prado is finished. He was gored by three Sev 2's on Chicago. All he does now is drink herb tea and play with his screensavers.”

“Herb tea?”

“It is true, my friend.” Hernando shrugged again. Later he went to his office and sat in the dark for a long time. Then he sent e-mail to Michaels.

Michaels came to him while he was sipping a mocha. They sat silently for awhile, then he asked Michaels, “I need you to triage for me.”

Michaels looked down. “I don't do that anymore,” he said.

“This is different. The bugs are enormous. There are an infinity of bugs.”

“I'm finished with that,” Michaels said again. “I just want to live quietly.”

“Have you heard Prado is finished? He was badly gored. Now he can only drink herb tea.”

“Herb tea?” Michaels said.

“It is true,” he said sorrowfully.

Michaels stood up. “Then I will do it, my friend,” he said formally. “I will do it for Prado, who was once great with the bugs. I will do it for the time we filled Prado's office with bouncy balls, and for the time Prado wore his nerf weapons in the marketing hall and slew all of them with no fear and only a great joy at the combat. I will do it for all the pizza we ate and the bottles of Coke we drank.”

Together they walked slowly back, knowing it would be good. As they walked the rain dripped softly from the leaves, and the shuttles carried the bodies back from the meetings.
`
const textOptions = {
	strings: [text],
	typeSpeed: 0,
	showCursor: false,
	contentType: null,
	startDelay: 5000,
}

let userInput = []
function clearUserInput() {
	userInput = []
}

function goBack() {
	$(document).keypress((e) => {

		if (e.keyCode == 13) {
			userInput.push(e.keyCode)
		}

		if (userInput[userInput.length - 2] == 13 && userInput[userInput.length - 1] == 13) {
			clearUserInput()
			window.location.href = document.referrer
		}
		
		setTimeout(clearUserInput, 2000)
	})
}

$(document).ready(() => {

	if (document.title === 'LTF > UTF') {
		new Typed('#title', titleOptions)
		new Typed('#author', authorOptions)
		new Typed('#text', textOptions)

		goBack()

	} else if (document.title === 'UTF > LTF') {
		new Typed('#title', {
			strings: ['No.'],
			typeSpeed: 0,
			showCursor: false,
			contentType: null,
			startDelay: 1000,
		})

		goBack()

	} else {
		$(document).keypress((e) => {
			userInput = userInput.concat(String.fromCharCode(e.keyCode))
			if (userInput.join('').includes('ltf>utf')) {
				clearUserInput()
				window.location.href = '/secret'
			}

			if (userInput.join('').includes('utf>ltf')) {
				clearUserInput()
				window.location.href = '/notasecret'
			}
		})
	}	



})