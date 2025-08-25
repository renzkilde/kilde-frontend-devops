import React from "react";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import Facebook_icon from "../../Assets/Images/SVGs/Facebook_white.svg";
import LinkedIn_icon from "../../Assets/Images/SVGs/Linkedin_white.svg";
import mail_icon from "../../Assets/Images/SVGs/mail_white.svg";
import messenger_icon from "../../Assets/Images/SVGs/Messenger_white.svg";
import telegram_icon from "../../Assets/Images/SVGs/Telegram_white.svg";
import whatsapp_icon from "../../Assets/Images/SVGs/Whatsapp_white.svg";
import ROUTES from "../../Config/Routes";

const ReferralShareButtons = ({ user }) => {
  const referralLink = `${window.location.origin}${ROUTES.REGISTER}?referral=${user?.refferalCode}&utm_medium=ref-program&utm_campaign=${user?.number}`;

  const shareOptions = [
    {
      name: "Email",
      icon: mail_icon,
      url: `mailto:?subject=Join%20me%20on%20this%20platform&body=${encodeURIComponent(
        `Here's my referral link: ${referralLink}`
      )}`,
    },
    // {
    //   name: "LinkedIn",
    //   icon: LinkedIn_icon,
    //   url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    //     referralLink
    //   )}`,
    // },
    {
      name: "WhatsApp",
      icon: whatsapp_icon,
      url: `https://wa.me/?text=${encodeURIComponent(
        `Hey! Join using my referral link: ${referralLink}`
      )}`,
    },
    // {
    //   name: "Facebook",
    //   icon: Facebook_icon,
    //   url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    //     referralLink
    //   )}`,
    // },
    {
      name: "Telegram",
      icon: telegram_icon,
      url: `https://t.me/share/url?url=${encodeURIComponent(
        referralLink
      )}&text=${encodeURIComponent("Check this out!")}`,
    },
    // {
    //   name: "Messenger",
    //   icon: messenger_icon,
    //   url: `fb-messenger://share?link=${encodeURIComponent(referralLink)}`,
    // },
  ];

  const handleShare = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {shareOptions.map((option) => (
        <ButtonDefault
          key={option.name}
          title={<img src={option.icon} alt={option.name} />}
          onClick={() => handleShare(option.url)}
          style={{ width: "auto", padding: "8px" }}
        />
      ))}
    </>
  );
};

export default ReferralShareButtons;
