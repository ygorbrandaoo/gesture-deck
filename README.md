# GestureDeck

GestureDeck é uma aplicação web de apresentação controlada por gestos. A webcam é classificada em tempo real por um modelo treinado no Google Teachable Machine, e gestos validados são convertidos em comandos dos slides.

## Status

O front-end e a integração do modelo estão prontos. A aplicação mostra a predição atual, a confiança de todas as classes e o status real do modelo.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- TensorFlow.js
- Google Teachable Machine

## Como executar

```bash
git clone https://github.com/ygorgabrielbml/gesture-deck.git
cd gesture-deck
npm install
npm run dev
```

Abra o endereço indicado pelo Vite e permita o acesso à câmera quando o navegador solicitar.

Para verificar o código e gerar a versão de produção:

```bash
npm run lint
npm run build
```

## Estrutura

```text
public/model/       Modelo exportado pelo Teachable Machine
src/components/    Componentes da interface
src/data/          Conteúdo demonstrativo dos slides
src/hooks/         Carregamento, predição e validação dos gestos
src/types/         Tipos compartilhados
```

## Modelo

O modelo de classificação de imagens foi treinado no Google Teachable Machine e exportado no formato TensorFlow.js. Seus arquivos `model.json`, `metadata.json` e `weights.bin` ficam em `public/model/`.

A classificação acontece localmente no navegador. Imagens da webcam não são enviadas para um servidor.

## Classes e ações

- `OPEN_PALM` - desligar a câmera
- `PEACE_SIGN` - próximo slide
- `CLOSED_FIST` - slide anterior
- `BACKGROUND` - nenhuma ação

A confiança exibida e usada para validar gestos é suavizada entre frames. Uma ação exige confiança mínima de 85% mantida por 650 ms. Depois da execução existe um cooldown visual de 2000 ms. Durante esse período nenhuma ação é executada novamente. Para repetir o mesmo comando, mostre `BACKGROUND` antes de fazer o gesto de novo.

## Dataset

O modelo utiliza quatro classes: `OPEN_PALM`, `PEACE_SIGN`, `CLOSED_FIST` e `BACKGROUND`. Esta seção poderá ser complementada com a fonte, a quantidade de imagens e o processo de treinamento.

## Demonstração

Screenshots, GIFs ou um vídeo curto poderão ser adicionados para demonstrar o reconhecimento dos gestos.
