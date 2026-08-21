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
- `HUMAN-FACE` - nenhuma ação

A confiança exibida e usada para validar gestos é suavizada entre frames. Uma ação exige confiança mínima de 85% mantida por 650 ms. Depois da execução existe um cooldown visual de 2000 ms. Durante esse período nenhuma ação é executada novamente. Para repetir o mesmo comando, mostre `BACKGROUND` ou `HUMAN-FACE` antes de fazer o gesto de novo.

## Datasets, créditos e licenças

O treinamento utilizou imagens de três datasets públicos. Eles serviram como fontes para as cinco classes do modelo: `OPEN_PALM`, `PEACE_SIGN`, `CLOSED_FIST`, `BACKGROUND` e `HUMAN-FACE`.

| Dataset | Autoria ou responsável | Conteúdo original | Licença ou condição de uso |
| --- | --- | --- | --- |
| [NUS Hand Posture Dataset II](https://www.ece.nus.edu.sg/stfpage/elepv/NUS-HandSet/) | Pramod Kumar Pisharady, Prahlad Vadakkepat e Ai Poh Loh, National University of Singapore | Posturas de mão e imagens de fundo | Uso acadêmico gratuito mediante citação do artigo associado |
| [gestures (hand)](https://www.kaggle.com/datasets/kritanjalijain/gestures-hand) | Kritanjali Jain | Gestos de mão pré-processados e imagens sem gesto | [CC0: Public Domain](https://creativecommons.org/publicdomain/zero/1.0/) |
| [Human Faces](https://www.kaggle.com/datasets/ashwingupta3012/human-faces) | Ashwin Gupta | Imagens de rostos humanos | [CC0: Public Domain](https://creativecommons.org/publicdomain/zero/1.0/) |

### NUS Hand Posture Dataset II

O dataset da National University of Singapore contém 10 classes registradas por 40 participantes em cenários naturais e com fundos complexos. A distribuição original inclui:

- 2.000 imagens RGB de posturas de mão em resolução 160 × 120;
- 750 imagens RGB em resolução 320 × 240 com ruídos humanos, como rostos ou pessoas ao fundo;
- 2.000 imagens RGB de fundo sem as posturas de mão.

A página oficial permite o uso gratuito em pesquisa acadêmica desde que o trabalho associado seja citado:

> PISHARADY, Pramod Kumar; VADAKKEPAT, Prahlad; LOH, Ai Poh. Attention Based Detection and Recognition of Hand Postures Against Complex Backgrounds. *International Journal of Computer Vision*, v. 101, n. 3, p. 403-419, 2013. [https://doi.org/10.1007/s11263-012-0560-5](https://doi.org/10.1007/s11263-012-0560-5).

### gestures (hand)

Publicado no Kaggle por [Kritanjali Jain](https://www.kaggle.com/kritanjalijain), o dataset disponibiliza 16.000 imagens pré-processadas. Ele reúne sete tipos de gesto (`fist`, `five`, `rad`, `peace`, `thumbs`, `straight` e `okay`) e um diretório `none` com imagens sem gestos para representar o fundo. O conteúdo foi publicado sob licença CC0.

### Human Faces

Publicado no Kaggle por [Ashwin Gupta](https://www.kaggle.com/ashwingupta3012), o dataset reúne mais de 7.200 imagens de rostos obtidas na web. A coleção inclui diferentes idades, perfis e grupos demográficos, além de algumas imagens geradas por GAN. O conteúdo foi publicado sob licença CC0 e foi utilizado como fonte para a classe `HUMAN-FACE`.

As quantidades acima descrevem os datasets de origem. O conjunto final usado no Teachable Machine passou por seleção e organização de acordo com as classes do GestureDeck.

## Demonstração

Screenshots, GIFs ou um vídeo curto poderão ser adicionados para demonstrar o reconhecimento dos gestos.
