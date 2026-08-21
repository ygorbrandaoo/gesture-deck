# GestureDeck

GestureDeck é uma aplicação web de apresentação controlada por gestos. A proposta é reconhecer gestos da mão pela webcam usando um modelo treinado no Google Teachable Machine e convertê-los em comandos de navegação.

## Status

O front-end inicial está em desenvolvimento. A integração com o modelo de reconhecimento será adicionada em uma próxima etapa.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- TensorFlow.js (futuramente)
- Google Teachable Machine (futuramente)

## Como executar

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

## Estrutura

```text
public/model/       Arquivos exportados do modelo
src/components/    Componentes da interface
src/data/          Conteúdo demonstrativo dos slides
src/types/         Tipos compartilhados
```

## Modelo

O modelo exportado pelo Google Teachable Machine ficará em `public/model/`. O TensorFlow.js ainda não faz parte desta etapa.

## Classes planejadas

Os nomes abaixo são provisórios e poderão mudar após a análise do dataset:

- `LEFT` - slide anterior
- `RIGHT` - próximo slide
- `ACTION` - mostrar ou ocultar detalhes
- `NEUTRAL` - nenhuma ação

## Dataset

Esta seção será atualizada com:

- nome e fonte do dataset;
- classes utilizadas;
- quantidade de imagens;
- processo de treinamento.

## Demonstração

Screenshots, GIFs ou um vídeo curto serão adicionados após a conclusão da integração.
