import React from "react";
import {UserAvatar} from "./avatar";
import {UserName} from "./name";

type UserInfoProps = {
  isAvatarLink: boolean,
  avatarSrc: string,
  userName: string,
}


export const UserInfo = (props: UserInfoProps) => {
  const {
    isAvatarLink,
    avatarSrc,
    userName,
  } = props;

  return (
    <div className={'annotation-popup__user'}>
      <UserAvatar avatarSrc={avatarSrc} isAvatarLink={isAvatarLink} userName={userName}></UserAvatar>
      <UserName userName={userName}></UserName>
    </div>
  );
}