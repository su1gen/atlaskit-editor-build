import React from "react";

type NameProps = {
  userName: string,
}


export const UserName = (props: NameProps) => {
  const {
    userName
  } = props;

  return (
    <div className={'annotation-popup__user-name'}>
      {userName}
    </div>
  );
}