exports.sendGridOptions = {
  msgSignup: {
    to: '', // Change to your recipient
    from: 'dario.cascone93@gmail.com', // Change to your verified sender
    subject: 'SubApp.it: Pagamento con Bonifico Bancario',
    html: 'Gentile cliente,<br/><br/>'
        + 'per completare l\'acquisto da lei richiesto, esegua un bonifico bancario alle coordinate di seguito riportate.<br/>'
        + 'Coordinate bancarie:<br/>'
        + 'INTESA SAN PAOLO - <strong>_______________________</strong><br/>'
        + 'IBAN: <strong>_____________________________________</strong><br/><br/>'
        + '<strong>ABBONAMENTO ANNUALE</strong><br/>'
        + 'Descrizione: Accesso al portale per la durata di un anno<br/>'
        + 'Importo: <strong>€ 170,00</strong><br/>'
        + 'Intestato a: <span style="color:#29ABF4">Subapp.it s.r.l.s</span>'
        + '<br/><br/>'
        + '<strong>ABBONAMENTO BIENNALE</strong><br/>'
        + 'Descrizione: Accesso al portale per la durata di due anno<br/>'
        + 'Importo: <strong>€ 305,00</strong><br/>'
        + 'Intestato a: <span style="color:#29ABF4">Subapp.it s.r.l.s</span><br/><br/>'
        + 'L’accesso al portale e la fattura saranno disponibili dopo la conferma dell\'avvenuta contabilizzazione del bonifico sul conto di <span style="color:#29ABF4">Subapp.it s.r.l.s</span><br/>'
        + '<br/>Distinti Saluti,<br/>'
        + '<span style="color:#29ABF4">Subapp.it s.r.l.s</span>'
  },
  forgottenPasswordMsg: {
    to: '', // Change to your recipient,
    from: 'dario.cascone93@gmail.com', // Change to your verified sender
    subject: 'SubApp.it: Reimposta password',
    html: 'Gentile cliente,<br/><br/>'
        + 'per completare il reimposta password, acceda al link di seguito riportato<br/>'
  }
}
