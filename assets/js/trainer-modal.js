// Dados dos treinadores
const trainers = {
  ernane: {
    img: 'assets/images/ernane.jpg',
    name: 'Ernane Peixoto',
    role: 'Professor de Boxe, Kickboxing e Muai thay',
    desc: 'Faixa preta, referência em lutas de contato e preparação física. Experiência em competições nacionais e internacionais, com foco em disciplina e evolução dos alunos.'
  },
  leandro: {
    img: 'assets/images/leandro.jpg',
    name: 'Leandro Boka',
    role: 'Sensei de Jiu-Jítsu',
    desc: 'Especialista em Jiu-Jítsu, com anos de experiência em ensino e competições. Valoriza técnica, respeito e desenvolvimento pessoal dos praticantes.'
  },
  luiz: {
    img: 'assets/images/luiz.jpg',
    name: 'Luiz Felipe',
    role: 'Sensei de Karatê',
    desc: 'Faixa preta de Karatê, apaixonado por formar atletas e cidadãos. Trabalha disciplina, respeito e autoconfiança em cada aula.'
  },
  ramila: {
    img: 'assets/images/ramila.jpg',
    name: 'Ramila',
    role: 'Professora de Kickboxing',
    desc: 'Instrutora dedicada ao Kickboxing, com foco em condicionamento, técnica e empoderamento dos alunos.'
  },
  anna: {
    img: 'assets/images/luiza.jpg',
    name: 'Anna Luiza',
    role: 'Professora de Kickboxing Feminino',
    desc: 'Especialista em aulas para o público feminino, promovendo saúde, autodefesa e autoestima através do Kickboxing.'
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
  document.getElementById('trainer-modal-desc').textContent = t.desc;
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
