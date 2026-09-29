import { FiArrowUpRight, FiBookOpen, FiDownload, FiFileText, FiMail, FiPlayCircle } from 'react-icons/fi'
import { SiGithub, SiInstagram, SiSubstack, SiTiktok, SiWhatsapp, SiYoutube } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa6'
import type { ChannelIcon, SocialIcon } from '@/lib/hub'

export const socialIcons: Record<SocialIcon, React.ComponentType<{ className?: string }>> = {
  tiktok: SiTiktok,
  instagram: SiInstagram,
  youtube: SiYoutube,
  linkedin: FaLinkedin,
  github: SiGithub,
}

export const channelIcons: Record<ChannelIcon, React.ComponentType<{ className?: string }>> = {
  newsletter: SiSubstack,
  vault: FiBookOpen,
  video: FiPlayCircle,
  news: FiFileText,
}

export { FiArrowUpRight as ArrowIcon, FiDownload as DownloadIcon, FiMail as MailIcon, SiWhatsapp as WhatsappIcon }
