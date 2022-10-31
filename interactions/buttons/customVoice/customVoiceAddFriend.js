const { ButtonBuilder, ActionRowBuilder } = require('discord.js')
const { get, ref, getDatabase, set } = require('firebase/database')
const { collect, wait } = require('utils')
/**
 * @file Button interaction: customVoiceAddFriend
 * @since 1.0.0
*/
module.exports = {
  id: 'customVoiceAddFriend',
  /**
  * @description Executes when the button with ID customVoiceAddFriend is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    await interaction.deferUpdate()
    const db = getDatabase()
    let friends = await get(ref(db, `users/${interaction.user.id}/friends`)).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val()
      } else {
        return []
      }
    })
    const buttons = interaction.message.components[0].components
    const disabledButtons = buttons.map((button) => {
      return ButtonBuilder.from(button).setDisabled(true)
    })
    const disabledRow = new ActionRowBuilder().addComponents(disabledButtons)
    const row = new ActionRowBuilder().addComponents(buttons)
    interaction.editReply({ content: 'Bitte erwähne den User, den du als Freund hinzufügen möchtest!', components: [disabledRow], ephemeral: true })
    const msg = await collect(interaction.channel, { filter: m => m.author.id === interaction.user.id, max: 1, time: 30000 })
    if (msg.size !== 0) {
      const user = msg.first().mentions.members.first()
      msg.first().delete()
      if (user) {
        if (friends.includes(user.id)) {
          interaction.editReply({ content: `${user} ist schon dein Freund!`, ephemeral: true })
        } else {
          friends.push(user.id)
          interaction.editReply({ content: `${user} wurde als Freund hinzugefügt!`, ephemeral: true })
          set(ref(db, `users/${interaction.user.id}/friends`), friends)
        }
      }
    } else {
      interaction.editReply({ content: 'Du hast zu lange gebraucht!', ephemeral: true })
    }
    await wait(2000)
    friends = await get(ref(db, `users/${interaction.user.id}/friends`)).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val()
      } else {
        return []
      }
    })
    const friendObjects = []
    if (friends.length > 0) {
      for (const friend of friends) {
        friendObjects.push(interaction.guild.members.cache.get(friend).toString())
      }
    } else {
      friendObjects.push('Du hast noch keine Freunde hinzugefügt!')
    }
    const friendString = friendObjects.join(' | ')
    interaction.editReply({
      content: `**Aktuelle Freunde:**\n\n${friendString}`,
      components: [row]
    })
  }
}
