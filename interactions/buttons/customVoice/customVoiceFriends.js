const { PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js')
const { get, ref, getDatabase } = require('firebase/database')
/**
 * @file Button interaction: customVoiceFriends
 * @since 1.0.0
*/
module.exports = {
  id: 'customVoiceFriends',
  /**
* @description Executes when the button with ID customVoiceFriends is called.
* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const channel = interaction.channel
    const db = getDatabase()
    if (channel.permissionsFor(interaction.user.id).has(PermissionsBitField.Flags.ManageChannels)) {
      const friends = await get(ref(db, `users/${interaction.user.id}/friends`)).then((snapshot) => {
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
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('customVoiceAddFriend')
          .setLabel('Freund hinzufügen')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('customVoiceRemoveFriend')
          .setLabel('Freund entfernen')
          .setStyle(ButtonStyle.Danger)
      )
      interaction.reply({ content: `**Aktuelle Freunde:**\n\n${friendString}`, components: [row], ephemeral: true })
    }
  }
}
