---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 2 ユーザー・インタフェイス / 4. アナタハ 英語ヲ 話シマスカ
current: ch02-04
prev: 03-ui-wizardry
prev-title: 3. UI の魔法
next: 05-new-link-in-the-chain
next-title: 5. チェーンの新しい環
origin: /user-interface/do-you-speak-english/
---
# Lesson 2 ユーザー・インタフェイス

## 4. アナタハ 英語ヲ 話シマスカ

現在、下記のカルチャ (言語と国) が WiX によってサポートされています。

- ar-SA
- bg-BG
- ca-ES
- cs-CZ
- da-DK
- de-DE
- el-GR
- en-US
- es-ES
- et-EE
- fi-FI
- fr-FR
- he-IL
- hi-IN
- hr-HR
- hu-HU
- it-IT
- ja-JP
- kk-KZ
- ko-KR
- lt-LT
- lv-LV
- nb-NO
- nl-NL
- pl-PL
- pt-BR
- pt-PT
- ro-RO
- ru-RU
- sk-SK
- sl-SI
- sr-LA
- sv-SE
- th-TH
- tr-TR
- uk-UA
- zh-CN
- zh-HK
- zh-TW

> 訳注：これらの言語は、コンパイルされて WixUI 拡張ライブラリに入っており、カルチャ名を指定するだけで使用できます。
> 統合環境を使っている場合は、プロジェクトのプロパティ・ダイアログに「カルチャ」欄がありますので、そこでカルチャ名を指定できます。
> カンマで区切って複数のカルチャ識別子を指定すると、その全部について、個別のインストーラが作成されます。
>
>     candle.exe SampleWixUI.wxs
>     light.exe -ext WixUIExtension -cultures:fr-fr SampleWixUI.wixobj

> 訳注：残念ながら、WiX に同梱されている日本語地域化ファイルの品質はあまり良くありません。
> 不明瞭な表現や不自然な言い回しが多く、中には明らかに誤訳と思われるものあります。
> 代替版 ([WixUI_Alt_ja-jp.zip](/samples/WixUI_Alt_ja-jp.zip)) を参考に供しますので、ご自由にお使い下さい。
> この代替版の作成については、「[オープンソース Win32ビルド \& 和訳 ( http://cml.s10.xrea.com/ )](http://cml.s10.xrea.com/)」
> の管理人である H さんのご協力を頂きました。
>
> 代替の言語ファイル(あなた自身が作ったもの)は、コマンド・ラインで直接に指定することが出来ます。
> 統合環境では、ソース・ファイルの中に .wxl ファイルを含めるだけで、適切なインストーラが自動的に作成されます。
>
>     candle.exe SampleWixUI.wxs
>     light.exe -ext WixUIExtension -loc path/WixUI_hu-hu.wxl
>               -out SampleWixUI.msi SampleWixUI.wixobj

