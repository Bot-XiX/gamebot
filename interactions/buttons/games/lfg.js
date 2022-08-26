const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js')
const { onValue, ref, getDatabase } = require('firebase/database')
/**
 * @file Button interaction: lfg
 * @since 1.0.0
*/
module.exports = {
  id: 'lfg',
  /**
* @description Executes when the button with ID lfg is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const events = interaction.guild.scheduledEvents.cache
    for (const event of events.values()) {
      if (event.description.includes(interaction.user.toString())) {
        return interaction.reply({ content: 'You already have a game scheduled!', ephemeral: true })
      }
    }
    const db = getDatabase()
    const id = interaction.guild.id
    const gameList = []
    const games = await ref(db, id + '/games')
    const unsub = onValue(games, async (snapshot) => {
      const games = await snapshot.val()
      for (const game in games) {
        await gameList.push({ label: games[game].name, value: game })
      }
      const LFGgame = new SelectMenuBuilder()
        .setCustomId('LFGgame')
        .setPlaceholder('Spiel')
        .addOptions(gameList)
      const row = new ActionRowBuilder().addComponents(LFGgame)
      interaction.reply({ content: 'Welches Spiel möchtest du spielen?', components: [row], ephemeral: true })
      unsub()
    })
  }
}
