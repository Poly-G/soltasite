import {
  Bricolage_Grotesque, Instrument_Sans, Inter_Tight, Rubik,
  Work_Sans, Cormorant_Garamond, Jost, Caveat, League_Gothic, Libre_Franklin,
} from 'next/font/google';

export const bricolage = Bricolage_Grotesque({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-bricolage', display: 'swap' });
export const instrument = Instrument_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-instrument', display: 'swap' });
export const interTight = Inter_Tight({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter-tight', display: 'swap', preload: false });
export const rubik = Rubik({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-rubik', display: 'swap', preload: false });
export const workSans = Work_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-work-sans', display: 'swap', preload: false });
export const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: '500', style: 'italic', variable: '--font-cormorant', display: 'swap', preload: false });
export const jost = Jost({ subsets: ['latin'], weight: '400', variable: '--font-jost', display: 'swap', preload: false });

export const caveat = Caveat({ subsets: ['latin'], weight: '600', variable: '--font-keshia-script', display: 'swap', preload: false });
export const leagueGothic = League_Gothic({ subsets: ['latin'], weight: '400', variable: '--font-keshia-poster', display: 'swap', preload: false });
export const libreFranklin = Libre_Franklin({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-keshia-read', display: 'swap', preload: false });
