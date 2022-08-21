const { ModalBuilder, TextInputBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const { onValue, ref, getDatabase, get } = require('firebase/database');
/**
 * @file Button interaction: lfcg
 * @since 1.0.0
*/
module.exports = {
  id: 'lfcg',
  /**
* @description Executes when the button with ID lfcg is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const db = getDatabase()
    const id = interaction.guild.id
    const premiumRole = JSON.stringify(await get(ref(db, id + '/game/premiumRole'))).slice(1, -1)
    const premiumRoleObj = interaction.guild.roles.cache.get(premiumRole)
    if( interaction.member.roles.cache.has(premiumRoleObj.id)) {
      const modalModal = new ModalBuilder().setCustomId('game').setTitle('LFG');
      const gameList = []
      const games = await ref(db, id + '/games')
      const unsub = onValue(games, async (snapshot) => {
        const games = await snapshot.val()
        for (const game in games) {
          await gameList.push({ label: games[game].name, value: game })
        }
        const LFGgame = new TextInputBuilder()
          .setCustomId('LFGgame')
          .setLabel('Spiel')
          .setPlaceholder('Spiel')
          .setStyle(1)
          .setRequired(true)
        const LFGtime = new TextInputBuilder()
          .setCustomId('LFGtime')
          .setLabel('Zeit')
          .setStyle(1)
          .setPlaceholder('HH:MM')
          .setRequired(true)
        const today = new Date()
        today.setDate(today.getDate())
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrow2 = new Date()
        tomorrow2.setDate(tomorrow2.getDate() + 2)
        const tomorrow3 = new Date()
        tomorrow3.setDate(tomorrow3.getDate() + 3)
        const LFGday = new SelectMenuBuilder()
          .setCustomId('LFGday')
          .setPlaceholder('Tag')
          .addOptions([
            {
              label: today.getDate() + '.' + (today.getMonth() + 1) + '.',
              description: today.toLocaleDateString("de-DE", { weekday: 'long' }),
              value: today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear()
            },
            {
              label: tomorrow.getDate() + '.' + (tomorrow.getMonth() + 1) + '.',
              description: tomorrow.toLocaleDateString("de-DE", { weekday: 'long' }),
              value: tomorrow.getDate() + '.' + (tomorrow.getMonth() + 1) + '.' + tomorrow.getFullYear()
            },
            {
              label: tomorrow2.getDate() + '.' + (tomorrow2.getMonth() + 1) + '.',
              description: tomorrow2.toLocaleDateString("de-DE", { weekday: 'long' }),
              value: tomorrow2.getDate() + '.' + (tomorrow2.getMonth() + 1) + '.' + tomorrow2.getFullYear()
            },
            {
              label: tomorrow3.getDate() + '.' + (tomorrow3.getMonth() + 1) + '.',
              description: tomorrow3.toLocaleDateString("de-DE", { weekday: 'long' }),
              value: tomorrow3.getDate() + '.' + (tomorrow3.getMonth() + 1) + '.' + tomorrow3.getFullYear()
            }
          ])
        const playerArray = []
        for (let i = 1; i < 16; i++) {
          playerArray.push({
            label: i + ' Player',
            description: 'Spieleranzahl',
            value: i.toString()
          })
        }
        const LFGplayers = new SelectMenuBuilder()
          .setCustomId('LFGplayers')
          .setPlaceholder('Spieler')
          .addOptions(playerArray)
        const LFGgameRow = new ActionRowBuilder().addComponents(LFGgame)
        const LFGtimeRow = new ActionRowBuilder().addComponents(LFGtime)
        const LFGdayRow = new ActionRowBuilder().addComponents(LFGday)
        const LFGplayersRow = new ActionRowBuilder().addComponents(LFGplayers)
        // Add inputs to the modal
        modalModal.addComponents(LFGgameRow, LFGtimeRow, LFGdayRow, LFGplayersRow)
        // Show the modal to the user
        await interaction.showModal(modalModal);
        unsub()
      })
    } else {
      interaction.reply({ content: 'Dieses Feature ist noch in Entwicklung!', ephemeral: true })
    }
  }
}
