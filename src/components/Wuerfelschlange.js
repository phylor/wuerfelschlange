import React, { useState } from "react";
import styled from "styled-components";

import Dice from "./Dice";

const randomDiceFace = () => Math.floor(Math.random() * 6) + 1;

const randomDices = () =>
  Array(40)
    .fill()
    .map(_ => randomDiceFace());

const dicesWithState = dices => {
  let index = 0;
  let withState = [];

  while (index < dices.length) {
    let diceFace = dices[index];
    let nextIndex = index + diceFace;

    if (nextIndex >= dices.length) {
      withState.push({ face: diceFace, state: "last" });

      for (let i = index + 1; i < dices.length; i++) {
        withState.push({ face: dices[i], state: "dropped" });
      }

      break;
    } else {
      withState.push({ face: diceFace, state: "hit" });

      for (let i = index + 1; i < nextIndex; i++) {
        withState.push({ face: dices[i], state: "skipped" });
      }

      index = nextIndex;
    }
  }

  return withState;
};

const isSolution = (dicesWithState, lastDiceIndex) => {
  let index = 0;

  while (index < dicesWithState.length) {
    let diceFace = dicesWithState[index].face;
    let nextIndex = index + diceFace;

    if (nextIndex >= dicesWithState.length) {
      return false;
    } else if (nextIndex == dicesWithState.length - 1) {
      return nextIndex == lastDiceIndex;
    } else {
      index = nextIndex;
    }
  }
};

const dicesWithoutDropped = dices =>
  dices.filter(({ face, state }) => state !== "dropped");

const DiceContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ColoredDices = ({ initialDices, dices }) => (
  <DiceContainer>
    {initialDices.map(({ face, state }, index) => {
      if (index <= dices.length - 1) {
        switch (dices[index].state) {
          case "hit":
            if (
              (index == 0 && initialDices[index].face != dices[index].face) ||
              initialDices[index].state != "hit"
            ) {
              return (
                <Dice key={index} face={dices[index].face} color="#8888cb" />
              );
            } else {
              return (
                <Dice key={index} face={dices[index].face} color="#55cb55" />
              );
            }
          case "skipped":
            return <Dice key={index} face={dices[index].face} color="#ddd" />;
          case "dropped":
            return (
              <Dice key={index} face={dices[index].face} color="#cb5555" />
            );
          case "last":
            return (
              <Dice
                key={index}
                face={dices[index].face}
                color="#000000"
                fontColor="#ffffff"
              />
            );
        }
      } else {
        return <Dice key={index} face={face} color="#cb5555" />;
      }
    })}
  </DiceContainer>
);

const lastDiceIndex = dices => dices.findIndex(({ state }) => state === "last");

const reroll = (initialDices, firstDices, setFirstDices) => {
  let rerolled = [...initialDices];

  rerolled[0] = randomDiceFace();

  firstDices[rerolled[0] - 1] = {
    face: rerolled[0],
    solved: isSolution(
      dicesWithoutDropped(dicesWithState(rerolled)),
      lastDiceIndex(dicesWithState(initialDices))
    )
  };
  setFirstDices(firstDices);

  return rerolled;
};

const FirstDice = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Solutions = ({ className, data }) => (
  <div className={className}>
    {data.map((dice, index) => (
      <StyledSolution key={index} face={dice.face} solved={dice.solved} />
    ))}
  </div>
);

const StyledSolutions = styled(Solutions)`
  display: flex;
  flex-wrap: wrap;
`;

const solutionColor = solved => {
  switch (solved) {
    case null:
      return "#eddd44";
    case true:
      return "#55cb55";
    case false:
      return "#cb5555";
  }
};

const StyledButton = styled.button`
  color: #5555cb;
  background-color: white;
  border: 2px solid #5555cb;
  padding: 1rem 1.5rem;
  font-weight: bold;
  font-size: 1.25rem;
  cursor: pointer;

  &:hover {
    color: white;
    background-color: #5555cb;
  }
`;

const StyledSolved = styled.div`
  margin-top: 0.25rem;
`;

const Solution = ({ className, face, solved }) => (
  <div className={className}>
    <div>{face}</div>
    <StyledSolved>{solved == null ? "?" : solved ? "👍" : "👎"}</StyledSolved>
  </div>
);

const StyledSolution = styled(Solution)`
  display: flex;
  flex-direction: column;
  background-color: ${props => solutionColor(props.solved)};
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0.5rem 0.75rem;
  align-items: center;
  width: 3rem;
`;

const ContainerJustifyBetween = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Wuerfelschlange = () => {
  const generateFirstDices = initialDices =>
    Array(6)
      .fill()
      .map((_, index) => ({
        face: index + 1,
        solved: index + 1 == initialDices[0] ? true : null
      }));

  const [initialDices, setInitialDices] = useState(randomDices());
  const [rerolledDices, setRerolledDices] = useState(null);
  const [firstDices, setFirstDices] = useState(
    generateFirstDices(initialDices)
  );

  const regenerate = () => {
    let dices = randomDices();
    setInitialDices(dices);
    setRerolledDices(null);
    setFirstDices(generateFirstDices(dices));
  };

  return (
    <React.Fragment>
      <h1>Würfelschlange</h1>
      <p>
        Experiment, dass im{" "}
        <a href="http://minkorrekt.de/">Podcast Minkorrekt</a> in der{" "}
        <a href="http://minkorrekt.de/minkorrekt-folge-161-gesichtswurst/">
          Folge 161
        </a>{" "}
        besprochen wurde.
      </p>

      <ContainerJustifyBetween>
        <h2>Initial</h2>
        <StyledButton onClick={() => regenerate()}>
          Schlange neu generieren
        </StyledButton>
      </ContainerJustifyBetween>

      <ColoredDices
        initialDices={dicesWithState(initialDices)}
        dices={dicesWithState(initialDices)}
      />

      <h2>Ersten Würfel neu würfeln</h2>
      <p>
        Augenzahl des ersten Würfels und ob mit diesem der letzte Würfel
        getroffen wird:
      </p>
      <FirstDice>
        <StyledSolutions data={firstDices} />
        <StyledButton
          onClick={() => {
            setRerolledDices(reroll(initialDices, firstDices, setFirstDices));
          }}
        >
          Würfeln
        </StyledButton>
      </FirstDice>

      {rerolledDices && (
        <ColoredDices
          initialDices={dicesWithoutDropped(dicesWithState(initialDices))}
          dices={dicesWithoutDropped(dicesWithState(rerolledDices))}
        />
      )}
    </React.Fragment>
  );
};

export default Wuerfelschlange;
