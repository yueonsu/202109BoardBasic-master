package com.koreait.basic.board;

import com.google.gson.Gson;
import com.koreait.basic.Utils;
import com.koreait.basic.board.model.BoardHeartEntity;
import com.koreait.basic.dao.BoardHeartDAO;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/board/heart")
public class BoardHeartServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        int iboard = Utils.getParameterInt(req, "iboard");
        String proc = req.getParameter("proc");
        BoardHeartEntity entity = new BoardHeartEntity();
        entity.setIboard(iboard);
        entity.setIuser(Utils.getLoginUserPk(req));

        int result = 0;
        switch (proc) {
            case "1": //좋아요 처리
                result = BoardHeartDAO.insBoardHeart(entity);
                break;
            case "2": //좋아요 취소 처리
                result = BoardHeartDAO.delBoardHeart(entity);
                break;
        }
        res.setContentType("application/json");
        res.setCharacterEncoding("UTF-8");
        PrintWriter out = res.getWriter();
        out.println(String.format("{\"result\" : %d }", result));
        out.flush();
    }
}