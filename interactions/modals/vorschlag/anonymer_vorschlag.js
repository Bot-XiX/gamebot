/**
 * @file Sample button interaction
 * @author Felix
 * @since 1.0.0
 */
const { MessageEmbed, MessageActionRow, MessageButton, Interaction } = require('discord.js')
module.exports = {
  id: 'anonymer_vorschlag',

  /**
   * @description Executes when the button with ID "vorschlag" is clicked.
   * @author Felix
   * @param {Object} interaction The Interaction Object of the command.
   */

  async execute(interaction, client) {
    const titel = interaction.fields.getTextInputValue('titel');
	  const beschreibung = interaction.fields.getTextInputValue('beschreibung');
    embed = new MessageEmbed()
      .setTitle(titel)
      .setDescription(beschreibung)
    interaction.channel
          .send({
            embeds: [embed],
            components: [],
          })
          .then(function (message) {
            message.react('👍')
            message.react('👎')
            message.startThread({
              name: `${titel}`,
              autoArchiveDuration: 1440*7,
              type: 'GUILD_PUBLIC_THREAD',
            })
    })
    .catch(function (error) {})
    async function run() {
      const row1 = new MessageActionRow().addComponents(
        new MessageButton().setLabel('Vorschlag').setCustomId('vorschlag').setStyle('PRIMARY'),
        new MessageButton().setLabel('Anonym').setCustomId('anonymer_vorschlag').setStyle('SECONDARY'),
        new MessageButton().setLabel('Event').setCustomId('event').setStyle('SECONDARY'),
      )
      const fetch = await interaction.channel.messages.fetch({ limit: 10 })
      var fetchfiltered = fetch.filter(function (list) {
        return list.content == 'Drücke hier um einen Vorschlag einzureichen'
      })
      var id = fetchfiltered.map(function (list) {
        return list.id
      })
      if (id.length != 0) {
        interaction.channel.messages
          .fetch(id.toString())
          .then((message) => {
            message.delete()
          })
          .catch({})
      }
      interaction.channel.send({
        content: 'Drücke hier um einen Vorschlag einzureichen',
        components: [row1],
      })
    }
    run().then().catch(console.error)
    require('dotenv').config()
    var api = process.env.trello_api
    var token = process.env.trello_token
    var Trello = require('trello-node-api')(api, token)
    var data = {
      name: titel,
      desc: beschreibung,
      pos: 'top',
      idList: '62016b6b6686ac1c549a0ed6',
    }
    // Trello.card
    //   .create(data)
    //   .then(function (response) {})
    //   .catch(function (error) {
    //     console.log('error', error)
    //   })
      interaction.reply({content: "Vorschlag eingereicht!\n\n Du kannst diese Nachricht jetzt verwerfen", ephemeral: true})
  },
}