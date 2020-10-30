import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "../scss/InfoBox.scss";

const InfoBox = ({ title, cases, total, active, isRed, ...props }) => {
  return (
    <Card
      className={`infoBox ${active && "infoBox__selected"} ${isRed && "infoBox__red"}`}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography
          className="infoBox__title"
          color="textSecondary"
          component="span"
        >
          {title}
          <h2 className={`infoBox__cases ${title === 'Recovered' && 'infoBox__cases--green'}`}>{cases} </h2>
        </Typography>
        <Typography
          className="infoBox__total"
          color="textSecondary"
          component="span"
        >
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
