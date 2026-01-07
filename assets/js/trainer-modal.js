// Dados dos treinadores
const trainers = {
  ernane: {
    img: 'assets/images/ernane.jpg',
    name: 'Ernane Peixoto',
    role: 'Professor de Boxe, Kickboxing e Muay Thai',
  desc: 'Um estoico servo de Deus. CEO da escola de lutas BFC. Graduado em Zootecnia, mestre em Ciência Animal, graduando em Educação Física. Campeão Centro-Oeste de Kickboxing 2016, tetracampeão goiano de Kickboxing (2019, 2022, 2024 e 2025), terceiro colocado no Campeonato Brasileiro de Kickboxing 2022, campeão do WGP 55. Técnico da equipe BFC de Kickboxing: 3ª colocada na Copa Goiás 2023, 1ª colocada no Campeonato Goiano 2024, 2ª colocada na Copa Goiás 2024, 3ª colocada no Campeonato Goiano 2025. Técnico de Boxe certificado pela CBBoxe, técnico da Seleção Goiana de Boxe em 2021, 2022, 2023 e 2025; eleito melhor técnico do Campeonato Centro-Oeste de Boxe 2023.'
  },
  leandro: {
    img: 'assets/images/leandro.webp',
    name: 'Leandro Boka',
    role: 'Sensei de Jiu-Jítsu',
  desc: 'Leandro Peixoto dos Santos, conhecido como BOKA. Pai de 3 filhas. Faixa-preta em Jiu-Jítsu 2º Dan. Educador físico. Professor de Jiu-Jítsu há 13 anos. Campeão Goiano de Jiu-Jítsu nos anos de 2013, 2014 e 2016. Campeão do Campeonato Centro-Oeste de Jiu-Jítsu em 2014. Campeão da 5ª Etapa Open Pires do Rio em 2015. Vice-campeão Goiano de Jiu-Jítsu nos anos de 2015 e 2022. Vice-campeão no Cup International Pro em 2023. Terceiro colocado no Campeonato Centro-Oeste de Jiu-Jítsu em 2015. Terceiro colocado no Campeonato Goiano de Jiu-Jítsu em 2013. Terceiro colocado no Winter Fall BJJ Pro em 2023.'
  },
  luiz: {
  img: 'assets/images/luiz.webp',
    name: 'Luiz Felipe',
    role: 'Sensei de Karatê',
  desc: 'LUIZ FELIPE DIAS MORAES, médico veterinário. Graduado à faixa preta em 2019, professor desde 2020 e atleta da seleção brasileira de karatê. Campeão Goiano (2014, 2015, 2016, 2019, 2022, 2023, 2024, 2025). Campeão Goiano Absoluto (2024). Campeão Copa Ricardo (2025). Campeão Federativo (2016). Campeão Centro-Oeste (2016). Campeão Best Of The Best (2016, 2019). Campeão Copa Arena (2024). Vice-campeão Mundial (2024). Vice-campeão Copa Canedo (2022, 2023). Vice-campeão Copa Brasil (2016). 3º lugar Campeonato Brasileiro (2022).'
  },
  ramila: {
  img: 'assets/images/ramila.webp',
    name: 'Ramila',
    role: 'Professora de Kickboxing',
  desc: 'Ramila Bernardes Gonçalves, advogada, assessora do Promotor de Justiça de Bela Vista de Goiás há 10 anos. Proprietária da Escola de Lutas BFC. Faixa-preta em Kickboxing. Terceira colocada no Campeonato Brasileiro de Kickboxing em 2019. Campeã das Copas Goiás de Kickboxing em 2023, 2024 e 2025. Campeã Goiana de Kickboxing em 2023, 2024 e 2025.'
  },
  anna: {
  img: 'assets/images/luiza.webp',
    name: 'Anna Luiza',
    role: 'Professora de Kickboxing Feminino',
  desc: 'Anna Luiza, 22 anos, cristã, concluindo a faculdade de enfermagem e no quarto período da faculdade de educação física. Começou no esporte aos 11 anos para emagrecer e treinou até os 14. Durante a pandemia chegou à obesidade grau 1, pesando 120 kg; em 2020 decidiu voltar a treinar Kickboxing para emagrecer. Emagreceu mais de 40 kg e atualmente é faixa marrom e atleta da BFC. Campeã Goiana e Campeã da Copa Goiás em 2023, 2024 e 2025. Campeã Brasileira em 2024. Campeã da Copa Brasil e detentora do cinturão do “BFC COMBATE”.'
  },
  vitor: {
  img: 'assets/images/vitor.webp',
    name: 'Vitor Manoel',
    role: 'Professor de Boxe e Kickboxing',
    desc: 'Vitor Manoel Silva dos Santos. Atleta há 4 anos de Boxe. Vice-campeão Goiano (2022). Campeão Goiano (2023). Medalha de ouro no Campeonato Centro-Oeste (2023). Detentor do cinturão do Saymon Fight, categoria 63,5 kg (2023). Vice-campeão Goiano (2024). Atleta de Kickboxing e Campeão Goiano (2025).'
  }
};

// Função para abrir o modal
function openTrainerModal(key) {
  const t = trainers[key];
  if (!t) return;
  document.getElementById('trainer-modal-img').src = t.img;
  document.getElementById('trainer-modal-img').alt = t.name;
  document.getElementById('trainer-modal-name').textContent = t.name;
  document.getElementById('trainer-modal-role').textContent = t.role;
    const descEl = document.getElementById('trainer-modal-desc');
    const parts = t.desc.split(/(?<=\.)\s+/).filter(p=>p.trim());
    descEl.innerHTML = parts.map(p => '<p class="trainer-desc-block">' + p.trim() + '</p>').join('');
  document.getElementById('trainer-modal-bg').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// Função para fechar o modal
function closeTrainerModal() {
  document.getElementById('trainer-modal-bg').style.display = 'none';
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.modalidades-grid .mod-card[data-trainer]').forEach(function(card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function() {
      openTrainerModal(card.getAttribute('data-trainer'));
    });
  });
  document.querySelector('#trainer-modal-bg .close-modal').addEventListener('click', closeTrainerModal);
  document.getElementById('trainer-modal-bg').addEventListener('click', function(e) {
    if (e.target === this) closeTrainerModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeTrainerModal();
  });
});
