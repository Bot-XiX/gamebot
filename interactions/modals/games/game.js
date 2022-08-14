const { EmbedBuilder, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType, PermissionsBitField, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { get, ref, getDatabase } = require("firebase/database")
const moment = require("moment");

/**
 * @file Modal interaction: game
 * @since 1.0.0
*/
module.exports = {
  id: 'game',
  /**
* @description Executes when the modal with ID game is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    function hasDST (date = new Date()) {
      const january = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
      const july = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();

      return Math.max(january, july) !== date.getTimezoneOffset();
    }
    const events = interaction.guild.scheduledEvents.cache
    for(let event of events.values()) {
      if (event.description.includes(interaction.user.toString())) {
        return interaction.reply({ content: "You already have a game scheduled!", ephemeral: true })
      }
    }
    try {
      const mapArray = Array.from(interaction.fields.fields)
      if (moment(mapArray[1][1].value, "HH:mm", true).isValid()) {
        await interaction.deferReply({ ephemeral: true })
        const game = JSON.stringify(await get(ref(getDatabase(), interaction.guild.id + '/games/' + mapArray[0][1].value[0] + '/name'))).slice(1, -1)
        const logo = JSON.stringify(await get(ref(getDatabase(), interaction.guild.id + '/games/' + mapArray[0][1].value[0] + '/logo'))).slice(1, -1)
        let banner = JSON.stringify(await get(ref(getDatabase(), interaction.guild.id + '/games/' + mapArray[0][1].value[0] + '/banner'))).slice(1, -1)
        if (banner === "ul") {
          banner = null
        }
        const embed = new EmbedBuilder()
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
          .setTitle('Spielersuche')
          .addFields(
            { name: 'Spiel', value: game },
            { name: 'Anzahl Spieler', value: mapArray[3][1].value[0] },
            { name: 'Zeit', value: mapArray[1][1].value },
            { name: 'Tag', value: mapArray[2][1].value[0] }
          )
          .setFooter({ text: 'Das Event kann nur vom Ersteller geschlossen werden' })
        try {
          embed.setThumbnail(logo)
        } catch {
          null
        }
        const combinedDate = mapArray[2][1].value[0] + ' ' + mapArray[1][1].value + ':00'
        let date = await moment(combinedDate, "DD.MM.YYYY HH:mm", 'de').toDate()
        let channel = interaction.guild.channels.cache.get(JSON.stringify(await get(ref(getDatabase(), interaction.guild.id + '/game/waitingChannel'))).slice(1,-1))
        try {
          const rowRow = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('deleteEvent')
                .setLabel('Event schließen')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🗑️')
            );
          await interaction.guild.scheduledEvents.create({
            name: game,
            scheduledStartTime: date,
            channel: channel,
            description: `${interaction.member} sucht nach ${mapArray[3][1].value[0]} Spieler(n), um ${game} zu spielen.`,
            image: banner,
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            entityType: GuildScheduledEventEntityType.Voice
          }).then(async event => {
            rowRow.addComponents(
              new ButtonBuilder()
                .setURL(`https://discord.com/events/${interaction.guild.id}/${event.id}`)
                .setLabel('Event ansehen')
                .setStyle(ButtonStyle.Link)
                .setEmoji('🔗')
            )
            const role = interaction.guild.roles.cache.get(JSON.stringify(await get(ref(getDatabase(), interaction.guild.id + '/game/waitingRole'))).slice(1, -1))
            interaction.channel.send({ content: role.toString(), embeds: [embed], components: [rowRow] })
            interaction.editReply({ content: 'Event erfolgreich erstellt!' })
            async function run () {
              const row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setLabel('Looking for Group')
                  .setCustomId('lfg')
                  .setStyle(ButtonStyle.Primary)
                  .setEmoji('🎮')
              )
              const fetch = await interaction.channel.messages.fetch({
                limit: 10
              })
              const fetchfiltered = fetch.filter(function (list) {
                return (
                  list.content === 'Drücke hier um nach einer Gruppe zu suchen'
                )
              })
              const id = fetchfiltered.map(function (list) {
                return list.id
              })
              if (id.length !== 0) {
                interaction.channel.messages
                  .fetch(id.toString())
                  .then((message) => {
                    message.delete()
                  })
                  .catch({})
              }
              interaction.channel.send({
                content: 'Drücke hier um nach einer Gruppe zu suchen',
                components: [row1]
              })
            }
            run()
          })
        } catch (e) {
          console.log(e)
          interaction.editReply({ content: 'Event liegt in der Vergangenheit' })
        }
      }
    } catch {
      null
    }
  }
}
