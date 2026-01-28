import requests
import streamlit as st
import re

API_CHAT = "http://0.0.0.0:8000/v1/chat"
API_GEN = "http://0.0.0.0:8000/v1/generate"

st.set_page_config(page_title="Local LLM", layout="centered")
st.title("Local LLM")

mode = st.sidebar.selectbox(
    "Mode",
    ["Chat", "Generate"],
)

temperature = st.sidebar.slider("Temperature", 0.0, 2.0, 0.7, 0.05)
top_p = st.sidebar.slider("Top-p", 0.0, 1.0, 0.95, 0.05)
top_k = st.sidebar.slider("Top-k", 0, 100, 40, 1)

if "chat_messages" not in st.session_state:
    st.session_state.chat_messages = []

if mode == "Chat":
    for msg in st.session_state.chat_messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    prompt = st.chat_input("Message")

    if prompt:
        st.session_state.chat_messages.append(
            {"role": "user", "content": prompt}
        )

        with st.chat_message("assistant"):
            placeholder = st.empty()
            acc = ""

            resp = requests.post(
                API_CHAT,
                json={
                    "messages": st.session_state.chat_messages,
                    "temperature": temperature,
                    "top_p": top_p,
                    "top_k": top_k,
                    "stream": True,
                },
                stream=True,
                timeout=600,
            )

            for line in resp.iter_lines():
                if not line:
                    continue
                if line.startswith(b"data:"):
                    token = line.decode().replace("data:", "")
                    acc += token

                    clean = re.sub(r"\s+", " ", acc)
                    clean = re.sub(r"\s+([.,!?;:])", r"\1", clean)

                    placeholder.markdown(clean)


        st.session_state.chat_messages.append(
            {"role": "assistant", "content": acc}
        )

else:
    st.subheader("Text Generation")

    system_prompt = st.text_area("System Prompt (optional)")
    prompt = st.text_area("Prompt")

    if st.button("Generate") and prompt:
        placeholder = st.empty()
        acc = ""

        resp = requests.post(
            API_GEN,
            json={
                "system_prompt": system_prompt or None,
                "prompt": prompt,
                "temperature": temperature,
                "top_p": top_p,
                "top_k": top_k,
                "stream": True,
            },
            stream=True,
            timeout=600,
        )

        for line in resp.iter_lines():
            if not line:
                continue
            if line.startswith(b"data:"):
                token = line.decode().replace("data:", "")
                acc += token
                placeholder.markdown(acc)
