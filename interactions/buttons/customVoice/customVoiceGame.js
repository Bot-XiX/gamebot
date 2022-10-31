const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js')

/**
 * @file Button interaction: customVoiceGame
 * @since 1.0.0
*/
module.exports = {
  id: 'customVoiceGame',
  /**
  * @description Executes when the button with ID customVoiceGame is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    const row = new ActionRowBuilder()
    const selectMenu = new SelectMenuBuilder(
      {
        customId: 'CVgameSelect',
        placeholder: 'Spiel auswählen',
        minValues: 1,
        maxValues: 1
      })
    selectMenu.addOptions(
      { label: 'Watch Together', value: '880218394199220334' },
      { label: 'Poker Night', value: '755827207812677713' },
      { label: 'Chess in the Park', value: '832012774040141894' },
      { label: 'Letter League', value: '879863686565621790' },
      { label: 'Word Snacks', value: '879863976006127627' },
      { label: 'Spellcast', value: '852509694341283871' },
      { label: 'Checkers In The Park', value: '832013003968348200' },
      { label: 'Blazing 8s', value: '832025144389533716' },
      { label: 'Putt Party', value: '945737671223947305' },
      { label: 'Land-io', value: '903769130790969345' },
      { label: 'Bobble League', value: '947957217959759964' },
      { label: 'Ask Away', value: '976052223358406656' },
      { label: 'Know What I Meme', value: '950505761862189096' },
      { label: 'Bash Out', value: '1006584476094177371' }
    )
    row.addComponents(selectMenu)
    interaction.reply({ content: 'Wähle ein Spiel aus:', components: [row], ephemeral: true })
  }
}
