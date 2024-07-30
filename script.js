const questions = {
  "Fale sobre o Calendário Cósmico": "O Calendário Cósmico é um método para visualizar a cronologia do universo, escalando sua história de 13,8 bilhões de anos para um único ano. Nessa visualização, o Big Bang ocorre em 1º de janeiro, e o momento atual é meia-noite em 31 de dezembro. Essa escala ajuda a entender a imensidão do tempo cósmico e o quão recente é a história humana em comparação.",
  "Explique a Equação de Drake": "A Equação de Drake é um argumento probabilístico usado para estimar o número de civilizações extraterrestres ativas e comunicativas na Via Láctea. Foi formulada por Frank Drake em 1961 e leva em consideração fatores como a taxa de formação de estrelas, a fração de estrelas com planetas e a probabilidade de vida evoluir para um nível inteligente.",
  "Quem foi Carl Sagan?": "Carl Sagan (1934-1996) foi um astrônomo, cientista planetário, cosmologista e comunicador científico americano. Ele é mais conhecido por seu trabalho como popularizador da ciência e seus esforços para aumentar a compreensão pública da ciência. Sagan desempenhou um papel de destaque nas missões de exploração espacial da NASA e coescreveu e apresentou a premiada série de televisão de 1980 'Cosmos: Uma Viagem Pessoal'."
};

async function askQuestion(question = null) {
  const input = document.getElementById('question-input');
  const answerContainer = document.getElementById('answer-container');
  const avatar = document.querySelector('.cosmos-avatar');
  const loadingIndicator = document.getElementById('loading');
  const sendButton = document.querySelector('.input-container button');

  if (!question) {
    question = input.value.trim();
  }

  if (question) {
    input.disabled = true;
    sendButton.disabled = true;

    answerContainer.innerHTML = `<strong>Q: ${question}</strong>`;
    loadingIndicator.style.display = 'block';

    avatar.style.transform = 'scale(1.1)';
    setTimeout(() => {
      avatar.style.transform = 'scale(1)';
    }, 300);

    let answer;

    if (question in questions) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      answer = questions[question];
    } else {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          "input_value": question
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };

        const response = await fetch("http://127.0.0.1:7861/api/v1/run/cosmos-ked?stream=false", requestOptions);
        const result = await response.json();

        answer = result.outputs[0].outputs[0].results.message.data.text;
      } catch (error) {
        console.error('Error:', error);
        answer = "Sorry, there was an error processing your question. Please try again later.";
      }
    }

    loadingIndicator.style.display = 'none';
    answerContainer.innerHTML += `<br><br>${answer}`;

    input.disabled = false;
    sendButton.disabled = false;
    input.value = '';
  }
}