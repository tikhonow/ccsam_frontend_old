import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { emit } from "./messenger";
import Rating from "@mui/material/Rating";
import Chip from "@mui/material/Chip";


type CardProps = {
  name: string;
  args?: any;
  image?: string;
  descr?: string;
  purpose?: string;
}

export default function MediaCard(props: CardProps) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={props.image}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.name}
          <Chip label={props.purpose} />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.descr}
        </Typography>
        <Rating
          name="simple-controlled"
        />
      </CardContent>
      <CardActions>
        <Button size="small"
                onClick={(e) => {
                  emit("OPEN_EXAMPLE", props.args);
                }}>Открыть</Button>
        <Button disabled size="small">Загрузить отчет</Button>
      </CardActions>
    </Card>
  );
}
