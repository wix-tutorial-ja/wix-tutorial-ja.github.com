---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 6 COM、式の構文、その他 / 9. 環境に優しく
current: ch06-09
prev: 08-new-user-on-the-block
prev-title: 8. 新顔のユーザー
next: 10-xml
next-title: 10. XML
origin: /com-expression-syntax-miscellanea/environmentally-friendly/
---
#  Lesson 6 COM、式の構文、その他

## 9. 環境に優しく

環境変数をインストールするためには、コンポーネントの中で **Environment** タグを使います。

    <Environment Id='UpdatePath' Name='PATH' Action='create' System='yes'
        Part='last' Value='[INSTALLDIR]' />

**Action** 属性によって、コンポーネントがインストールされる時に何をすべきかを指定します。
指定できる値は、*create*, *set* および *remove* です。
**Part** 属性が新しい値の割り当て方を左右します。
*all* は新しい値で元の値を置き換え、*first* は新しい値を元の値の前に追加し、*last* は新しい値を元の値の後ろに追加します。
**Permanent='yes'** にすると、その環境変数は製品が削除されても残りますが、そうでなければ、一緒に削除されます。
**System** は、環境変数がシステムの環境空間に追加されるか、ユーザーの環境空間に追加されるかを指定します。
環境変数の名前には、必ず、すべて大文字を使って下さい。